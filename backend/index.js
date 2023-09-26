//for Data Base Mongo//
const uri = 'mongodb+srv://nhnamAdmin1:Namvip93817@cluster0.rk9dttt.mongodb.net/';
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

//thông tin data base//
const NameDataBase = 'Data_Store';


//
const today = new Date();
const getdate = JSON.stringify(today).slice(1, 11);
console.log(getdate);


//thêm dữ liệu vào data base//
async function Add(DataBaseClient, Collection, Document) {
    Document.Amount = await parseInt(Document.Amount);
    
    await DataBaseClient.collection(Collection).insertOne(Document);
    await console.log(`Added to ${Collection} done!`);
}

//
async function Read(DataBaseClient, Collection, Condition) {
    //tìm document theo điều kiện//
    const cursor =  await DataBaseClient.collection(Collection).find(Condition).sort({ date: 1 });

    const result = await cursor.toArray();

    return result;
}


//kết nối đến data base//
async function DataBase(client, Document, type, TimeFilter) {
    try {
        await client.connect();
        const DataBaseClient = client.db(NameDataBase);
        
        
        switch(type) {
            case "saveSpend":
                //gọi hàm add để thêm dữ liệu vào data base//
                await Add(DataBaseClient, "Spend_Data", Document);
                break;
            case "saveReceive":
                //gọi hàm add để thêm dữ liệu vào data base//
                await Add(DataBaseClient, "Receive_Data", Document);
                break;
            case "reload":   
                const result_reload = await Read(DataBaseClient, "Spend_Data",
                    {
                        //lọc theo ngày từ client gửi đến//
                        date: { $gte: TimeFilter.since , $lt: TimeFilter.toDate }, 
                    });
                return result_reload;
            case "fullLoad":    
                //truyền vào object rỗng đê load full database//
                const result_fullLoadSpend = await Read(DataBaseClient, "Spend_Data", {});
                const result_fullLoadReceive = await Read(DataBaseClient, "Receive_Data", {});

                //đặt điều kiện để lấy dữ liệu tính toán số dư//
                const result_SpendSince = await Read(DataBaseClient, "Spend_Data", { date: { $gte: "2023-09-23"} });

                return {
                    FullSpend :result_fullLoadSpend, 
                    FullReceive: result_fullLoadReceive,
                    SpendSince: result_SpendSince
                };
            default:
                break
        }
    } catch (e) {
        console.error(e);
    }
}



// For backend and express//////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const cors = require("cors");

console.log("App listen at port 3000");

app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

	resp.send("App is Working");
	// You can check backend is working or not by
	// entering http://loacalhost:5000
	
	// If you see App is working means
	// backend working properly
});



//nhận request save từ client gửi đến//
app.post("/SaveSpend", async (req, resp) => {
	try {
        console.log(req.body);

        //gọi Data Base để lưu dữ liệu//
        DataBase(client, req.body, 'saveSpend');

        //trả dữ liệu về client//
        resp.send(req.body);
    } catch (e) {
		resp.send("Something Went Wrong");
	}
});



//khi load trang web//
app.post( "/onloadRequest", async (req, resp) => {
    try {
        console.log(req.body);

        const result = await DataBase(client, "", "reload", req.body.TimeFilter);

        // console.log(JSON.stringify(result));

        resp.send(JSON.stringify(result));
    } catch(e) {
        console.error(e);
    }
});


//full DataBase load request//
app.post('/fullDataBaseSpentLoadRequest', async (req, resp) => {
    try {
        console.log(req.body);

        const result = await DataBase(client, "", "fullLoad");
        // console.log(result);
        resp.send(JSON.stringify(result));
    } catch(e) {
        console.log(e);
    }
})


//
app.post('/SaveReceive', (req, resp) => {
    try {
        console.log(req.body);  

        DataBase(client, req.body, 'saveReceive');

        resp.send(req.body);
    } catch(e) {
        console.log(e);
    }
})


//port server//
app.listen(3001);