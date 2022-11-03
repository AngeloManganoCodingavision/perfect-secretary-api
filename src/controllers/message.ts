import axios from "axios";
import { CalendarEvent, EventType } from "../models/CalendarEvent";
import { Patient } from "../models/Patients";

export const sendWhatsappMessage = (event: CalendarEvent) => {
    const messageReq = createMessageJson(event);
    return axios.post('https://graph.facebook.com/v15.0/110427305202440/messages', messageReq, {
        headers: {
            Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
        },
    })
}

const createMessageJson = (event: CalendarEvent) => {
  const patientRef = event.patientRef as Patient;
  let messageReq;
  if(event.type === EventType.Private) {
    messageReq = {
      "messaging_product": "whatsapp",
      "to": "393921523928", //event.patientRef.phoneNumber
      "type": "template",
      "template": {
          "name": "private_appointment",
          "language": {
              "code": "it",
              "policy": "deterministic"
          },
          "components": [
              {
                "type": "body",
                "parameters": [
                  {
                    "type": "text",
                    "text":  `${event.start.toLocaleDateString("it")}`
                  },
                  {
                    "type": "text",
                    "text": `${event.start.toLocaleTimeString('it').slice(0, -3)}`
                  },
                  {
                    "type": "text",
                    "text": `${event.end.toLocaleTimeString('it').slice(0, -3)}`
                  },
                  {
                    "type": "text",
                    "text": `${event.note}`
                  }
                ]
              }
          ]
      }
    }
  } else {
    messageReq = {
      "messaging_product": "whatsapp",
      "to": "393921523928", //event.patientRef.phoneNumber
      "type": "template",
      "template": {
          "name": "appointment",
          "language": {
              "code": "it",
              "policy": "deterministic"
          },
          "components": [
              {
                "type": "body",
                "parameters": [
                  {
                    "type": "text",
                    "text": `${patientRef.gender === 'M' ? 'Sig.' : 'Sig.ra'} ${patientRef.name} ${patientRef.lastname}`
                  },
                                      {
                    "type": "text",
                    "text":  `${event.start.toLocaleDateString("it")}`
                  },
                                      {
                    "type": "text",
                    "text": `${event.start.toLocaleTimeString('it').slice(0, -3)}`
                  }
                ]
              }
          ]
      }
    }
  }

  return messageReq;
}