import express from 'express';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { url } from 'inspector';
import fetch from 'node-fetch'; 

// import { config } from 'dotenv';


// add for checking if provided url exists

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // redirect route to our API
  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get('/filteredimage', async(req: Request, res:Response) => {
    let { image_url } = req.query;
    console.log(`got a request to process image at url:${image_url}`);
    // const exists = await urlExists(url_string);
    
    try {
      const response = await fetch(image_url, {method: 'HEAD'});
      if (response.ok) { // got answer 200~300
        let files = filterImageFromURL(image_url)
                    .then((file_list) => {
                      console.log(`got back the following ${file_list}`)
                      res.status(200).send({message: `thank you for doing business`})
                    })
                    .catch((error)=> {
                      res.status(400).send({ message: `Something went wrong with processing the image at ${image_url}` });
                    });
        
      } else { // response was note from 200 till 300
        console.log(`got response ${response.status}, ${response.statusText}`)
        res.status(400).send({ message: `Image url not ok. Got ${response.status}, ${response.statusText}` });
      }
    } catch (error) {
      return res.status(400).send({ message: `Error: Malformed image_url: ${image_url}` });
    }

      
    // console.log(`result of urlExists: ${exists}`);
    
});
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();