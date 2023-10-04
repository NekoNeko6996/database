//Modun//
const DataBase_Module = require('./DataBase_Module');
const Math_Module = require('./Math_Module');

// For backend and express//////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const cors = require("cors");

//cổng giao tiếp//
const PORT = 8000;

console.log(`App listen at port ${PORT}`);

app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

	resp.send("App is Working");
	// You can check backend is working or not by
	// entering http://loacalhost:8000
	
	// If you see App is working means
	// backend working properly
});



//nhận request save từ client gửi đến//
app.post("/SaveSpend", async (req, resp) => {
	try {
        console.log(req.body);

        //gọi Data Base để lưu dữ liệu//
        await DataBase_Module.DataBase(req.body, 'saveSpend');

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

        const result = await DataBase_Module.DataBase("", "reload", req.body.TimeFilter);
        
        await DataBase_Module.DataBase("", "MonthlyDataAggregation", req.body.ConstTimeFilter);

        //console.log(JSON.stringify(result));

        resp.send(JSON.stringify(result));
    } catch(e) {
        console.error(e);
    }
});


//full DataBase load request//
app.post('/fullSpendAndBalanceRequest', async (req, resp) => {
    try {
        console.log(req.body);

        //gọi data base tính toán để trả về Full spend và Account Balance//
        const result = await DataBase_Module.DataBase("", "fullLoad");
        resp.send(JSON.stringify(result));
    } catch(e) {
        console.log(e);
    }
})


//
app.post('/SaveReceive',  async (req, resp) => {
    try {
        console.log(req.body);  

        await DataBase_Module.DataBase(req.body, 'saveReceive');

        resp.send(req.body);
    } catch(e) {
        console.log(e);
    }
})


//
app.post('/SearchRequest', async (req, resp) => {
    try {
        console.log(req.body);
        // const result = await DataBase_Module.DataBase(req.body.searchString, 'searchRequest');

        const ObjectResult = await Math_Module.ConversionStringToObject(req.body.SearchString);

        const SearchResult = await DataBase_Module.DataBase(ObjectResult, 'searchRequest');
        
        resp.send(JSON.stringify(SearchResult));
    } catch(e) {
        console.log(e);
    }
})


//
app.post('/MonthDataInYearRequest', async (req, resp) => {
    try {
        console.log(req.body);

        const result = await DataBase_Module.DataBase("", "Data12Month");


        resp.send(JSON.stringify(result));
    } catch(e) {
        console.log(e);
    }
})


//port server//
app.listen(PORT);