export const delete_item = async(_id) => {
    if(window.confirm('Are you sure?')) {
        let result = await fetch("http://localhost:8000/delete_item",
        {
            method:"post",
            body: JSON.stringify(
                {
                    itemID: _id,
                    date: new Date()
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(result) {
            window.alert('Delete done!');
        }
    }
}
