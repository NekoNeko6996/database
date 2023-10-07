//
require('dotenv').config({ path: '../local.env' });

//Module//
const Math_Module = require('./Math_Module');


//biến môi trường//
const uri = process.env.DB_URI || 'localhost';
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
//
const NameDataBase = process.env.DB_NAME || 'local';
//
const today = new Date();
const getdate = JSON.stringify(today).slice(1, 11);
const year = getdate.slice(0, 4);
const month = getdate.slice(5, 7);
//const day = getdate.slice(8, 10);


//update data base//
async function UpdateDataBase(Client, Collection, filterValue, Document) {
    await Client.collection(Collection).updateOne(
        filterValue,        //tên trường cần update//
        { $set: Document}   //dữ liệu cần update//
    )
    console.log(`${Collection} is update!`);
}

//thêm dữ liệu vào data base//
async function Add(Client, Collection, Document) {
    Document.Amount = await parseInt(Document.Amount);
    
    await Client.collection(Collection).insertOne(Document);
}

//
async function Read(Client, Collection, Condition, Limit) {
    //tìm document theo điều kiện//
    const cursor =  await Client.collection(Collection).find(Condition).sort({ date: -1 }).limit(Limit || 100);
    const result = await cursor.toArray();
    return result;
}


//kết nối đến data base//
module.exports.DataBase = async function(Document, type, TimeFilter) {
    try {
        await client.connect();
        const DataBaseClient = await client.db(NameDataBase);

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
                    //tổng tiền đã dùng//
                    FullSpend : await Math_Module.SumDataAmount(result_fullLoadSpend), 
                    //số dư tài khoảng bằng số tiền hiện có trừ đi số tiền đã sữ dụng//
                    AccountBalance: (await Math_Module.SumDataAmount(result_fullLoadReceive) - await Math_Module.SumDataAmount(result_SpendSince))
                };
            case "MonthlyDataAggregation":
                const result_Month_raw = await Read(DataBaseClient, "Spend_Data",
                    {
                        date: { $gte: TimeFilter.since },
                    })

                const result_Month_after_calculate = await Math_Module.SumDataAmount(result_Month_raw);

                const Month_Find = await Read(DataBaseClient, "Data_Month", {month: TimeFilter.since.slice(5, 7)});
                
                //nếu tìm không ra object chữa dữ liệu tổng của tháng thì length sẽ = 0 và sẽ tạo object mới để chứa dữ liệu//
                //ngược lại thì chỉ update object đó//
                const length = await Month_Find.length;

                if(length === 0) {
                    await Add(DataBaseClient, "Data_Month", 
                    {
                        Content: "Dữ Liệu Tổng Của Tháng",
                        Amount: result_Month_after_calculate,
                        date: `${year}-${month}`,
                        month: `${month}`,
                        year: `${year}`
                    });
                } else {
                    await UpdateDataBase(DataBaseClient, "Data_Month", 
                    { month: `${month}` , year: `${year}`},
                    { Amount: result_Month_after_calculate }
                    )
                }   
                break;
            case 'searchRequest':
                //gọi read data để đọc những document trùng với yêu cầu từ client//
                const result_databaseFullLoad_searchRequest = await Read(DataBaseClient, 'Spend_Data', Document);

                //trả về//
                return result_databaseFullLoad_searchRequest;

            case 'Data12Month':
                const Data12Month = await Read(DataBaseClient, 'Data_Month', {}, 12);
                return Data12Month;
            default:
                break;
        }
    } catch (e) {
        console.error(e);
    }
}