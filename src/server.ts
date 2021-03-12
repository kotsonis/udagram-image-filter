import express from 'express';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { url } from 'inspector';
import fetch from 'node-fetch'; 
import { reject, resolve } from 'bluebird';
import { checkServerIdentity } from 'tls';


// declare function to check if image_url is valid
async function check_image_url(image_url:any) {
    let response = await fetch(image_url, { method: 'HEAD' })
    if (response.ok) {
      return image_url
    } else {
      console.log(`tried ${image_url}, Got ${response.status}, ${response.statusText}`)
      throw new Error(`Invalid image_url ${image_url}: ${response.status}, ${response.statusText}`);
    }
}

// add for checking if provided url exists

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
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

  
  app.get('/filteredimage', async (req: Request, res: Response) => {
    let { image_url } = req.query;
    console.log(`got a request to process image at url:${image_url}`);
    try {
      let valid_image_url = await check_image_url(image_url)
      let processed_image = await filterImageFromURL(valid_image_url)
      res.status(200).sendFile(processed_image, ()=>{
        deleteLocalFiles([processed_image])
      })
    } catch (e) {
      // catch any exceptions from check_image_url, filterImageFromURL, and deleteLocalFiles (amongst others)
      res.status(422).send({message:`${e}`})
    }
      
  });
  //! END @TODO1

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