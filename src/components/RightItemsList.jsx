import React, { useState, useEffect } from "react";
import { usePOSContext } from "../contexts/PosContext";
import axios from "axios";

function RightItemsList() {
  const [itemCount, setItemCount] = useState({
    khichadi: "",
    pavBhaji: "",
    lot: "",
    cheesePizza: "",
    vegPizza: "",
    thali: "",
    pesto: "",
    chat: "",
    lemonade: "",
    tea: "",
    coffee: "",
  });

  const { addItemToLeftList } = usePOSContext();

  const getStockInfoFromDataBase = async () => {
    try {
      // const response = await axios.get('http://localhost:8000/api/stock');
      const response = await axios.get(
        "https://shayona-orders.vercel.app/api/stock"
      );
      // console.log(response.data)
      setItemCount(response.data[0]); // assuming response.data is an array and we need the first object
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const updateStockCount = async (item, newCount) => {
    try {
      // await axios.put(`http://localhost:8000/api/stock/${item}`, {
      await axios.put(`https://shayona-orders.vercel.app/api/stock/${item}`, {
        count: newCount,
      });
      setItemCount((prevCount) => ({
        ...prevCount,
        [item]: newCount,
      }));
    } catch (error) {
      console.error("Error updating stock count:", error);
    }
  };

  const handleItemClick = (item, price, currentCount) => {
    if (currentCount > 0) {

      const newCount = currentCount - 1;
      updateStockCount(item, newCount);
      addItemToLeftList(item, price);
    } else {
      alert("Out of stock");
    }
  };

  useEffect(() => {
    getStockInfoFromDataBase();
  }, []);

  return (
    <div className="item-selection">
      <h2 className="items_title">Available Items</h2>
      <div className="row">
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("khichadi", 5.0, itemCount?.khichadi)
            }
          >
            <img src="khichadi.jpeg" className="card-img-top" alt="Khichadi" />
            <div className="card-body">
              <h5 className="card-title item_title">
                Khichadi ({itemCount?.khichadi})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("pav_bhaji", 6.0, itemCount?.pav_bhaji)
            }
          >
            <img
              src="pav_bhaji.jpeg"
              className="card-img-top"
              alt="Pav Bhaji"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Pav Bhaji ({itemCount?.pav_bhaji})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() => handleItemClick("lot", 3.0, itemCount?.lot)}
          >
            <img src="Khichu-3.jpg" className="card-img-top" alt="Papdi lot" />
            <div className="card-body">
              <h5 className="card-title item_title">
                Papdi lot ({itemCount?.lot})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() => handleItemClick("chat", 5.0, itemCount?.chat)}
          >
            <img src="chat.jpeg" className="card-img-top" alt="Samosa Chat" />
            <div className="card-body">
              <h5 className="card-title item_title">
                Samosa Chat ({itemCount?.chat})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("cheese_pizza", 6.0, itemCount?.cheese_pizza)
            }
          >
            <img
              src="cheese_pizza.jpeg"
              className="card-img-top"
              alt="Cheese Pizza"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Cheese Pizza ({itemCount?.cheese_pizza})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("veg_pizza", 7.0, itemCount?.veg_pizza)
            }
          >
            <img
              src="veg_pizza.webp"
              className="card-img-top"
              alt="Veg Pizza"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Veg Pizza ({itemCount?.veg_pizza})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("pesto", 8.0, itemCount?.pesto)
            }
          >
            <img src="pesto.jpeg" className="card-img-top" alt="Pesto Pizza" />
            <div className="card-body">
              <h5 className="card-title item_title">
                Pesto Pizza ({itemCount?.pesto})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList("Extra Pav", 1.0)}
          >
            <img
              src="extra_pav.jpeg"
              className="card-img-top"
              alt="Extra Pav"
            />
            <div className="card-body">
              <h5 className="card-title item_title">Extra Pav</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("thali", 10.0, itemCount?.thali)
            }
          >
            <img
              src="thali.jpeg"
              className="card-img-top"
              alt="Thali Special"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Special Thali ({itemCount?.thali})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("lemonade", 3.50, itemCount?.lemonade)
            }
          >
            <img
              src="lemonade.jpeg"
              className="card-img-top"
              alt="Lemonade"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Lemonade ({itemCount?.lemonade})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("tea", 2.50, itemCount?.tea)
            }
          >
            <img
              src="tea.jpeg"
              className="card-img-top"
              alt="Tea"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Tea ({itemCount?.tea})
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card card_item mb-3"
            onClick={() =>
              handleItemClick("coffee", 2.50, itemCount?.coffee)
            }
          >
            <img
              src="coffee.jpeg"
              className="card-img-top"
              alt="Coffee"
            />
            <div className="card-body">
              <h5 className="card-title item_title">
                Coffee ({itemCount?.coffee})
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightItemsList;
