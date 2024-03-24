const uploadimage = async (req, res) => {
    if (req.method === 'POST') {
      try {
        const { imageData } = req.body;
        const imgurClientId = process.env.IMGUR_CLIENT_ID;
        const clientIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            'Authorization': `Client-ID ${imgurClientId}`,
            'Content-Type': 'application/json',
            'X-Forwarded-For': clientIpAddress
          },
          body: JSON.stringify({ image: imageData })
        });
  
        const data = await response.json();

        if (response.ok) {
          const imageUrl = data.data.link;
          res.status(200).json({ imageUrl });
        } else {
          console.error('Error uploading image to Imgur:', data);
          res.status(500).json({ error: data });
        }
      } catch (error) {
        console.error('Error uploading image to Imgur:', error);
        res.status(500).json({ error: data });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  
  export default uploadimage