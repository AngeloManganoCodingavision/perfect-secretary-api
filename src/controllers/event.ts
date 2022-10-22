import { Timestamp } from "firebase-admin/firestore";
import db from "../../firebase";
import { CalendarEvent } from "../models/CalendarEvent";

const eventsRef = db.collection('events');
const patientsRef = db;

export const getAllEvents = (req: any, res: any) => {
    eventsRef.get()
    .then(async (response) => {
        const referencedEvents = [] as CalendarEvent[];
        response.forEach( (event) => {
            const eventDate = new Timestamp(event.data().start.seconds, event.data().start.nanoseconds).toDate();           
            referencedEvents.push({...event.data() as CalendarEvent, start: eventDate, id: event.id});
        })
        const eventList: CalendarEvent[] = await getUserData(referencedEvents);       
        res.status(200).json(eventList);
    })
    .catch((error) => {
        res.status(500).send(error);
    })
};

export const addEvent = (req: any, res: any) => {
    const eventReq = {...req.body, added: new Date(req.body.added), start: new Date(req.body.start), patientRef: db.doc(req.body.patientRef)}
    eventsRef.add(eventReq)
    .then((newEvent) => {
      const event: CalendarEvent = {...eventReq, id: newEvent.id};
      return getUserData([event]);
    })
    .then((referencedEvent) => {      
        res.status(200).json(referencedEvent[0]);
    })
    .catch((error) => {
        res.status(500).send(error);
    })
  }

  export const updateEvent = (req: any, res: any) => {
    eventsRef.doc(req.params.id).update(req.body)
    .then(() => {      
        res.status(200).send('L\'evento è stato correttamente aggiornato');
    })
    .catch((error) => {
        res.status(500).send(error);
    })
  }

export const deleteEvent = (req: any, res: any) => {
    eventsRef.doc(req.params.id).delete()
    .then(() => {
        res.status(200).send('L\'evento è stato correttamente eliminato');
    })
    .catch((error) => {
        res.status(500).send(error);
    })
};


async function getUserData(referencedEvents: CalendarEvent[]): Promise<CalendarEvent[]> {
    try {
        const eventList = [] as CalendarEvent[];
        await Promise.all(
            referencedEvents.map(async (event) => {
                const userData = await patientsRef.doc(event.patientRef.path).get();               
                const patientRef = {...userData.data(), id: userData.id};
                const referencedEvent = {...event, patientRef};
                eventList.push(referencedEvent);
            })
        );
    
        return eventList;
    } catch(error: any) {
        throw new Error(error);
    }
}