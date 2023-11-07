//better alert -- SweetAlert//
import swal from "sweetalert";

//
export const delete_item_alert = (_id) => {
  swal("Delete Item", "Are you sure?", "warning", {
    buttons: ["Cancel", "Delete it!"],
  }).then((value) => {
    if (value) {
      delete_item(_id);
    }
  });
};
const delete_item = async (_id) => {
  let result = await fetch(`http://192.168.1.62:8000/delete_item`, {
    method: "post",
    body: JSON.stringify({
      itemID: _id,
      date: new Date(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  result = await result.json();
  if (result) {
    swal("Delete Item", "Done!", "success");
  }
};
