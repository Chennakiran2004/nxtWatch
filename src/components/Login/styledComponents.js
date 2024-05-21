import styled from 'styled-components'

export const LoginContainer = styled.div`
  height: 100vh;
  padding: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`

export const LoginCardContainer = styled.div`
  box-shadow: 0px 0px 5px #00000050;
  border-radius: 15px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  @media screen and (min-width: 768px) {
    min-width: 25%;
    max-width: 30%;
  }
`

export const WebsiteLogo = styled.img`
  width: 40%;
  @media screen and (min-width: 768px) {
    width: 63%;
  }
`

export const Label = styled.label`
  text-align: left;
  align-self: flex-start;
  font-size: 14px;
  padding: 0px 20px 15px 0px;
  font-family: 'Roboto';
  font-weight: 600;
  color: #475569;
`

export const LoginInput = styled.input`
  width: 100%;
  height: 35px;
  padding-left: 10px;
  border: 1px solid;
  border-color: #94a3b8;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 10px;
  outline: none;
`
export const Form = styled.form`
  padding-top: 10px;
`
export const ShowPasswordLabel = styled.label`
  font-size: 16px;
  cursor: pointer;
`

export const LoginButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 12px 0px 12px 0px;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 500;
  font-family: Roboto;
  font-size: 15px;
  cursor: pointer;
  margin-top: 28px;
`
export const ErrorMsg = styled.p`
  color: #ff0000;
  margin: 0px;
  font-size: 14px;
  padding-top: 6px;
  font-weight: 400;
`
