import fetch from "node-fetch";

export const getToken = async () => {
  const url = "https://api.iamport.kr/users/getToken";
  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imp_key: process.env.PORTONE_API_KEY,
      imp_secret: process.env.PORTONE_API_SECRET,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.response.access_token;
  } catch (error) {
    console.error("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const refund = async (event) => {
  const { merchant_uid } = event.body ? JSON.parse(event.body) : {};
  const url = "https://api.iamport.kr/payments/cancel";

  try {
    const accessToken = await getToken();
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ merchant_uid }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log("data", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error canceling payment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
