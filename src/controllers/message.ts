import axios from "axios";

export const sendMessage = (req: any, res: any) => {
    const messageReq = {
        "messaging_product": "whatsapp",
        "to": "393921523928",
        "type": "template",
        "template": {
            "name": "sample_shipping_confirmation",
            "language": {
                "code": "en_US"
            },
            "components": [
                {
                  "type": "body",
                  "parameters": [
                    {
                      "type": "text",
                      "text": "Your package has been shipped. It will be delivered in 5 business days."
                    }
                  ]
                }
              ]
        }
    }
    axios.post('https://graph.facebook.com/v15.0/110427305202440/messages', messageReq, {
        headers: {
            Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
        },
    })
    .then(() => {
        res.status(200).send('Messaggio di promemoria inviato correttamente');
    })
    .catch((error) => {
        res.status(500).send(error);
    })
}