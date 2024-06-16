import { useEffect,useState } from "react";

const useFetchData = (url,params) => {
    const [data,setData]=useState([]);
    const [error,setError]=useState(null);
   useEffect(()=>{
        const fetchData = async () => {
          try {
            const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(params)
                }
            );
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            console.log(jsonData);
            setData(jsonData);
            setError(null);
          }catch(err){
            //console.error('Error fetching data : ',err);
            setError(err.message);
          }
        };
        fetchData();
      },[url]);
    return {error,data};
}
 
export default useFetchData;