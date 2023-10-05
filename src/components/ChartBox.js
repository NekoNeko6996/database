import React from "react";

//biểu đồ//
//cột ngang//
//để nhận nhiều tham số thì dùng props//
function ChartBoxHorizontalColumn(props) {
    let MaxValue = 0;
    let indexValue = 0;

    //tìm phần tử có amount lớn nhất//
    props.dataResp.map((data, index) => {
        if(data.Amount > MaxValue) MaxValue = data.Amount;
        indexValue = index;
        return 0;
    })

    const StyleChartBoxDiv = {
        gridTemplateRows: `repeat(${indexValue + 1}, 30px)`,
    } 

    const html_char = props.dataResp.map((data, index) => {
        return <div className='ColumnContainer-div' key={`colCont-horizon-div${index}`}>
            <div className='columnChartBox' key={`${data._id}${index}`} style={
                {
                    height: "90%",
                    width: `${(data.Amount/MaxValue)*60}%`,
                }}> <div className='TextContentChart-div'key={`text-cont-chart-h-div${index}`}><p className='TextContentChart-p' key={`text-conte-h-p${index}`}>{data.Amount.toLocaleString("vi-VN")}</p></div>
            </div>
            <p className='date-char-v-p' key={`date-chart-h-p${index}`}>{data.date}</p>
        </div>
    })

    return (
        <div className='chartBox-div' style={StyleChartBoxDiv}>
            <p id="title-chart-month">Data for the Month</p>
            {html_char}
        </div>
    )
}


//cột dọc//
function ChartBoxVerticalColumn(props) {
    let MaxValue = 0;
    let indexValue = 0;

    //tìm phần tử có amount lớn nhất//
    props.dataResp.map((data, index) => {
        if(data.Amount > MaxValue) MaxValue = data.Amount;
        indexValue = index;
        return 0;
    })

    const StyleChartBoxDiv = {
        gridTemplateColumns: `repeat(${indexValue + 1}, 30px)`,
    }

    const html_char = props.dataResp.map((data, index) => {
        return <div className='ColumnContainer-vertical-div' key={`colCont-vert-div${index}`}>
            <div className='columnChartBox-vertical' key={`${data._id}${index}`} style={
                {
                    width: "90%",
                    height: `${(data.Amount/MaxValue)*70}%`,
                }}> <div className='TextContentChart-vertical-div' key={`text-cont-chart-v-div${index}`}><p className='TextContentChart-p-vertical' key={`text-conte-v-p${index}`}>{data.Amount.toLocaleString("vi-VN")}</p></div>
            </div>
            <p className='date-char-vertical-p' key={`date-chart-v-p${index}`}>{data.month}-{data.year}</p>
        </div>
    })
    //.reverse để đảo ngược thứ tự của element trong mảng item//
    return (
        <div className='chartBox-vertical-div' style={StyleChartBoxDiv}>
            <p id="title-chart-year">Data for the Year</p>
            {html_char}
        </div>
    )
}
//
function ChartBodyContainer(props) {
    console.log("render: Chart");
    return (
        <div>
            <ChartBoxHorizontalColumn dataResp={props.dataSpend}/>
            <ChartBoxVerticalColumn dataResp={props.data12Month} />
        </div>
    )
}

export default React.memo(ChartBodyContainer);