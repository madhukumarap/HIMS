import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'

const PatientBill = () => {
 const navigate = useNavigate()
 const pathologyTest = () => {
  navigate("/pathologyBills")
 }
 const consaltationTest = () => {
  navigate("/doctorConsaltationBills")
 }
 const diagonosticsTest = () => {
  navigate("/diagonosticsBills")
 }
 return (
  <div>

   <div>

    <Button onClick={pathologyTest} as="input" type="button" value="Pathology" />{' '}
    <Button onClick={consaltationTest} as="input" type="button" value="Doctor Consaltation" />{' '}
    <Button onClick={diagonosticsTest} as="input" type="button" value="Diagonostics" />
   </div>
  </div>
 )
}

export default PatientBill