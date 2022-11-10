import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import AppClass from './AppClass';
import React from "react"

// Write your tests here
const submit = document.querySelector('#submit')


test('render test', ()=>{
  render(<AppClass />)
})

test('renders 1 move.', async () => {
  const app = render(<AppClass />)
  const button = app.getByText(/UP/i)
  fireEvent.click(button)
  expect(screen.getByText(/you/i)).toHaveTextContent(/You moved 1 time/i)
});

test('renders 1 move then resets.', async () => {
  const app = render(<AppClass />)
  const button = app.getByText(/UP/i)
  fireEvent.click(button)
  expect(screen.getByText(/you/i)).toHaveTextContent(/You moved 1 time/i)
  const reset = app.getByText(/reset/i)
  fireEvent.click(reset)
  expect(screen.getByText(/you/i)).toHaveTextContent(/You moved 0 times/i)


});


test ('submitting with no email gives error', async () =>{
  const app = render(<AppClass />)
  const email = app.getByPlaceholderText(/type email/i)
  fireEvent.submit(email)
  const error= await screen.findByText(/ouch/i)
  expect(error).toHaveTextContent(/Ouch: email is required/i)

})
