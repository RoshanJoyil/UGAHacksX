const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGMyZGM5NC1lMGM1LTQ0ODUtYWQxZC1kNzQ0ZmE0YWI4NjYiLCJlbWFpbCI6ImNvbGluY2h1YXp5QGljbG91ZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjc1YWI2ZmE0NGVlODIwNjJmMGUiLCJzY29wZWRLZXlTZWNyZXQiOiJjMTU2NWFhNWJmODE3YWQ2M2Q2YmNlZTk2Mjg5ZjdiMGJjNmFjYWY0NTkxMDI1ZTA3ZmViMjIxNmJlMWQxZjkzIiwiZXhwIjoxNzcwNTMzNzQzfQ.aSr-6dZKVDZ7ZR5YIw3l4ug2zyEc2l1elrE6ExVd99c";

async function pinFileToIPFS() {
  try {
    const text = "Hello World!";
    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], "hello-world.txt");
    const data = new FormData();
    data.append("file", file);

    const request = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: data,
      }
    );
    const response = await request.json();
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

await pinFileToIPFS();
