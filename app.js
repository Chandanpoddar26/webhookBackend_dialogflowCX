const express= require('express');
const bodyParser= require('body-parser');
const { notStrictEqual } = require('assert');
const fs= require('fs');
const app= express();
const port=process.env.PORT || 4000;
// Middleware to parse incoming JSON payloads
app.use(bodyParser.json());
const collectRegion = async (request) => {
    const respp={
        'messages':[
            {
                'text':{
                    'text':['Great! I am here to help']
                }
            },
            {
                'text':{
                    'text':['Please select a region you work in']
                }
            }
        ]
    }
    
    const params = {
        anomaly_detect: 'false'
    };
    
    return {fulfillmentResponse:respp, sessionInfo: { parameters: params } };
};
const handlers = {
    collectRegion
};
// Route to handle webhoook requests
app.post('',async (req,res)=>{
    // Extract the request body
    const tag = req.body.fulfillmentInfo.tag;
    const request=req.body
    // Log the request for debugging
    console.log('Received webhook request',req.body);
    console.log('Here is tag',tag);
    /*
    // Sample response with parameters setting
    const response={
        'fulfillmentResponse':{
            'messages':[
                {
                    'text':{
                        'text':['This is response from local Backend']
                    }
                },
                {
                    'text':{
                        'text':['here we are with second msg']
                    }
                },
                {
                    "payload":
                    {
                        "richContent": [
                          [
                            {
                              "type": "info",
                              "title": "Info item title",
                              "subtitle": "Info item subtitle",
                              "image": {
                                "rawUrl": "https://th.bing.com/th/id/OIP.Qrc-HQICcs8D8oKDmtkptAHaE7?rs=1&pid=ImgDetMain"
                              },
                              "anchor": {
                                "href": "https://example.com"
                              }
                            },
                            {
                                "type": "info",
                                "title": "Info item title",
                                "subtitle": "Info item subtitle",
                                "image": {
                                  "rawUrl": "https://th.bing.com/th/id/OIP.Qrc-HQICcs8D8oKDmtkptAHaE7?rs=1&pid=ImgDetMain"
                                },
                                "anchor": {
                                  "href": "https://example.com"
                                }
                              }

                          ]
                        ]
                      }
                }
               
                
            ]
        },
        'sessionInfo':{
            "parameters":{
                "room_type":"Luxury"
            }
        }
    }  
    
    // Send response back to dialogflow CX
    res.json(response);
    */
    const handler = handlers[tag];

    if (handler) {
        try {
            const response = await handler(request);
            console.log('Response:', response);
            res.json(response);
        } catch (err) {
            console.error('ERROR:', err);
            res.status(500).send(`ERROR: ${err.message}`);
        }
    } else {
        const err = new Error(`Unknown tag: ${tag}`);
        console.error('ERROR:', err);
        res.status(500).send(`ERROR: ${err.message}`);
    }

   
});
app.listen(port,()=>{
    console.log(`Server is renning on port ${port}`)
})