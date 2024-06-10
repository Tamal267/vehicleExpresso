import { useEffect, useState } from 'react'
import ParkDetails from '../components/ParkInfo'
import { useParksContext } from '../hooks/useParksContext'

const AddParkAdmin = () => {
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [emailsForPark, setEmailsForPark] = useState([])
  const { parks, dispatch } = useParksContext()

  useEffect(() => {
    console.log(email)
    const searchParksEmail = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/searchparksusingemail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        dispatch({ type: 'SET_PARKS', payload: data })
      }
    }
    searchParksEmail()
  }, [email, dispatch])

  useEffect(() => {
    const serachEmailsforPark = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/findemailsforpark',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country, city, area, name }),
        },
      )
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setEmailsForPark(data)
      }
    }
    serachEmailsforPark()
  }, [country, city, area, name])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('address: ', country, city, area, name)

    const address = `${area}, ${city}, ${country}`

    fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=86dfeb373186498b815247be64b0a611`,
    )
      .then((geoloc) => geoloc.json())
      .then(async (data) => {
        console.log('location data: ', data)
        setError(null)

        const response = await fetch(
          'http://localhost:4000/api/parking/addparkadmin',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              country,
              city,
              area,
              name,
              status,
              longitude: data.features[0].geometry.coordinates[0],
              latitude: data.features[0].geometry.coordinates[1],
            }),
          },
        )
        const dt = await response.json()
        console.log('lon-lat: ', dt)

        if (response.ok) {
          dispatch({ type: 'ADD_PARK', payload: dt })

          const serachEmailsforPark = async () => {
            const response = await fetch(
              'http://localhost:4000/api/parking/findemailsforpark',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country, city, area, name }),
              },
            )
            const dat = await response.json()
            if (response.ok) {
              console.log(dat)
              setEmailsForPark(dat)
            }
          }
          serachEmailsforPark()
        } else {
          setError(dt.error)
        }
      })
  }

  return (
    <div className="addParkAdmin">
      <form
        className="serachParkForm"
        onSubmit={handleSubmit}
      >
        <label>Park Administrator Email: </label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <h4>Insert Park</h4>
        <hr />

        <label>Country:</label>
        <input
          type="text"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
        />
        <label>City:</label>
        <input
          type="text"
          onChange={(e) => setCity(e.target.value)}
          value={city}
        />
        <label>Area:</label>
        <input
          type="text"
          onChange={(e) => setArea(e.target.value)}
          value={area}
        />
        <label>Park Name:</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label>Status:</label>
        <input
          type="text"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
        />
        <br />
        <button>
          <span class="material-symbols-outlined">nature</span>Add Park
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <div>
        <div className="parks">
          {email && (
            <div>
              <h4>Such parks where {email} is admin</h4>
              <hr />
              {parks && parks.map((park) => <ParkDetails park={park} />)}
            </div>
          )}
          {!email && <h4>EMPTY EMAIL</h4>}
        </div>
        {emailsForPark.length > 0 && (
          <div className="emailsForPark">
            <div>
              <h4>Admin of the park</h4>
              <hr />
              {emailsForPark.map((email) => (
                <div className="adminList">
                  <strong>
                    <span
                      class="material-symbols-outlined"
                      style={{ color: '#142d4c' }}
                    >
                      verified_user
                    </span>
                    {email.NAME}
                    <br />
                    <span
                      class="material-symbols-outlined"
                      style={{ color: '#142d4c' }}
                    >
                      mail
                    </span>
                    {email.EMAIL}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddParkAdmin
