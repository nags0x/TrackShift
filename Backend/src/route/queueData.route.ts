import { Router } from "express";
import { handleQueueData } from "../controllers/queueData.controller";



const router = Router()



router.route('/queue-data').post(handleQueueData) //Handles the queue Data for persistence data storage 