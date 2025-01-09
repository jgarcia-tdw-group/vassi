import instance from "~/services/http_client";

export const getItemPrices = async (object, handleShowAlert) => {
    return await new Promise((resolve, _eject) => {
        instance
            .post("/display-catalog/item-prices", object)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                console.log(error.message);
                handleShowAlert("Error try again later", "error");
            });
    });
};

export const getCothPrices = async (handleShowAlert) => {
    return await new Promise((resolve, _eject) => {
        instance
            .get("/display-catalog/coth-prices")
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                console.log(error.message);
                handleShowAlert("Error try again later", "error");
            });
    });
};
