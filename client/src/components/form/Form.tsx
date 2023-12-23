import React, { ReactNode, useEffect, useRef, useState } from "react"

import FormInput from "./FormInput"

interface FormProps {
  title: string
}

interface Person {
  id: number
  firstName: string
  lastName: string
  dob: string
}

function Form({ title }: FormProps): ReactNode {
  const [isTrue, setIsTrue] = useState(true)
  const [crowd, setCrowd] = useState<Person[]>([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("")

  // refs
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const dobRef = useRef<HTMLInputElement>(null)

  const toggleTrue = () => {
    setIsTrue(!isTrue)
  }

  useEffect(() => {
    const people: Person[] = [
      {
        id: 1,
        firstName: "Mary",
        lastName: "Jones",
        dob: "1997-05-02",
      },
      {
        id: 2,
        firstName: "Jack",
        lastName: "Smith",
        dob: "1999-02-04",
      },
    ]
    setCrowd(people)
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (lastName !== "") {
      addPerson(firstName, lastName, dob)
    }
  }

  const addPerson = (newFirstName: string, newLastName: string, newDOB: string) => {
    const newPerson: Person = {
      id: crowd.length + 1,
      firstName: newFirstName,
      lastName: newLastName,
      dob: newDOB,
    }

    const newList = crowd.concat(newPerson)

    const sorted = newList.sort((lhs, rhs) => {
      if (lhs.lastName < rhs.lastName) {
        return -1
      } else if (lhs.lastName > rhs.lastName) return 1
      return 0
    })

    setCrowd(sorted)
    setFirstName("")
    setLastName("")
    setDob("")

    if (firstNameRef.current) {
      firstNameRef.current.value = ""
    }
    if (lastNameRef.current) {
      lastNameRef.current.value = ""
    }
    if (dobRef.current) {
      dobRef.current.value = ""
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-xl text-red-600">{title}</h1>
      <hr />
      {isTrue ? (
        <p>The current value of isTrue is true</p>
      ) : (
        <p>The current value of isTrue is false</p>
      )}
      <hr />
      <a
        href="#!"
        className="mb-2 me-2 mt-2 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={toggleTrue}
      >
        Toggle isTrue
      </a>
      <hr />
      <h3>People</h3>
      <ul className="list-inside list-disc space-y-1">
        {crowd.map((p) => (
          <li key={p.id}>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="ml-auto mr-auto mt-6 w-80">
          <FormInput
            title="First Name"
            type="text"
            name="first-name"
            autoComplete="first-name-new"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(event.target.value)
            }
            ref={firstNameRef}
          />
          <FormInput
            title="Last Name"
            type="text"
            name="last-name"
            autoComplete="last-name-new"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(event.target.value)
            }
            ref={lastNameRef}
          />

          <FormInput
            title="Date of Birth"
            type="date"
            name="dob"
            autoComplete="dob-new"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDob(event.target.value)}
            ref={dobRef}
          />

          <div className="mb-6 inline-block w-full">
            <input
              type="submit"
              value="Submit"
              className="float-left mb-2 me-2 mt-2 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            ></input>
          </div>
        </div>
      </form>
      <div>
        First Name: {firstName}
        <br />
        Last Name: {lastName}
        <br />
        DOB: {dob}
        <br />
      </div>
    </div>
  )
}

export default Form
