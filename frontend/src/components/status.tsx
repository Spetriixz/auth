import { useEffect, useState } from "react";

function Status() { 
  const [data, setData] = useState("")

  useEffect(() => {
    async function fetchApi() {
      const res = await fetch("/api/data")
      const data = await res.json()

      setData(data)
    }

    fetchApi()
  }, [])

  console.log(data)

  return (
    <p>{JSON.stringify(data)}</p>
  )
}

export default Status