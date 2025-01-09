import instance from "~/services/http_client";

export const login = async (object, handleShowAlert) => {
    return await new Promise((resolve, _eject) => {
        instance
            .post("/hows-that/login", object)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                console.log(error.message);
                handleShowAlert("Error try again later");
            });
    });
};

export const clientsList = async (object, handleShowAlert, setOpen) => {
    console.log(object);

    return await new Promise((resolve, _eject) => {
        instance
            .post("/hows-that/clients", object)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                console.log(error.message);
                handleShowAlert("Error try again later", "error");
                setOpen(false);
            });
    });
};

export const storeDisplayOrder = async (
    object,
    handleShowAlert,
    setLoading,
) => {
    return await new Promise((resolve, _eject) => {
        instance
            .post("/hows-that/store-display", object)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                console.log(error.message);
                handleShowAlert("Error try again later", "error");
                setLoading(false);
            });
    });
};
