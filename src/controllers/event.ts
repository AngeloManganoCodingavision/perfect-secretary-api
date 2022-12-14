import { DocumentData, Timestamp } from "firebase-admin/firestore";
import db from "../../firebase";
import { CalendarEvent, EventType } from "../models/CalendarEvent";
import { sendWhatsappMessage } from "../utils/message";

const eventsRef = db.collection('events');
const patientsRef = db;

export const getAllEvents = (req: any, res: any, next: any) => {
    eventsRef.get()
    .then(async (response) => {
        const referencedEvents = [] as CalendarEvent[];
        response.forEach( (event) => {
            const eventStartDate = new Timestamp(event.data().start.seconds, event.data().start.nanoseconds).toDate();       
            const eventEndDate = new Timestamp(event.data().end.seconds, event.data().end.nanoseconds).toDate();       
            referencedEvents.push({...event.data() as CalendarEvent, start: eventStartDate, end: eventEndDate, id: event.id});
        })
        const eventList: CalendarEvent[] = await getUserData(referencedEvents);
        res.status(200).json({data: eventList});
    })
    .catch((error) => {       
        next(error);
    });
};

export const addEvent = (req: any, res: any, next: any) => {
    const partnerRefProperty = req.body.partnerRef ? { partnerRef:  db.doc(req.body.partnerRef) } : {};
    const eventReq = {
        ...req.body, 
        added: new Date(req.body.added), 
        start: new Date(req.body.start), 
        patientRef: db.doc(req.body.patientRef),
        end: new Date(req.body.end),
        ...partnerRefProperty
    }
    let newReferencedEvent: CalendarEvent;
    eventsRef.add(eventReq)
    .then((newEvent) => {
      const event: CalendarEvent = {...eventReq, id: newEvent.id};
      return getUserData([event]);
    })
    .then((referencedEvent) => {
        newReferencedEvent = referencedEvent[0];
        return sendWhatsappMessage(newReferencedEvent);
    })
    .then(() => {      
        res.status(200).json({data: newReferencedEvent, message: 'L\'evento è stato correttamente aggiunto'});
    })
    .catch((error) => {       
        next(error);
    });
  }

  export const updateEvent = (req: any, res: any, next: any) => {
    eventsRef.doc(req.params.id).update(req.body)
    .then(() => {      
        res.status(200).send({message: 'L\'evento è stato correttamente aggiornato'});
    })
    .catch((error) => {       
        next(error);
    });
  }

export const deleteEvent = (req: any, res: any, next: any) => {
    eventsRef.doc(req.params.id).delete()
    .then(() => {
        res.status(200).send({message: 'L\'evento è stato correttamente eliminato'});
    })
    .catch((error) => {       
        next(error);
    });
};

async function getUserData(referencedEvents: CalendarEvent[]): Promise<CalendarEvent[]> {
    try {
        const eventList = [] as CalendarEvent[];
        await Promise.all(
            referencedEvents.map(async (event) => {
                const eventPatientRef = event.patientRef as DocumentData;
                const userData = await patientsRef.doc(eventPatientRef.path).get();               
                const patientRef = {...userData.data(), id: userData.id};
                let partnerRef = event.partnerRef;
                if(event.type === EventType.Couple) {
                    const eventPartnerRef = event.partnerRef as DocumentData;
                    const partnerData = await patientsRef.doc(eventPartnerRef.path as string).get();               
                    partnerRef = {...partnerData.data(), id: partnerData.id};
                }
                const referencedEvent = {...event, patientRef, partnerRef};
                eventList.push(referencedEvent);
            })
        );
    
        return eventList;
    } catch(error: any) {
        throw new Error(error);
    }
}