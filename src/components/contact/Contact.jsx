import "./contact.css"
import phoneIcon from "../../img/Phone_icon.png"
import emailIcon from "../../img/emailIcon.png"
import mapIcon from "../../img/mapIcon.png"
import { useRef, useState } from "react"
import emailjs from '@emailjs/browser';



const Contact = () => {
  const formRef = useRef();
  const [done, setDone] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_lukz3hu', 'template_0n9w5h8', formRef.current, 'l7MNbccg7nHAMkyJ7').then((result) => {
      console.log(result.text);
      setDone(true);
    }, (error) => {
      console.log(error.text);
    });
  }


  return (
    <div className="c">
      <div className="c-bg"></div>
      <div className="c-wrapper">
        <div className="c-left">
          <h1 className="c-title">Contact Us</h1>
          <div className="c-info">
            
            <div className="c-info-item">
              <img className="c-icon" src={emailIcon} alt="" />
              miguel.canseco@uttlaxcala.edu.mx<br />
              victor.terron@cimat.mx
              <br />
            </div>
            <div className="c-info-item">
              <img className="c-icon" src={mapIcon} alt="" />
              El Carmen Xalpatlahuaya, Huamantla, Tlaxcala, México.
            </div>
          </div>
        </div>
        <div className="c-right">
          <p className="c-desc">
            <b>Contact US</b>
          </p>

          <form ref={formRef} onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" name="user_name" /><br />
            <input type="text" placeholder="Subject" name="user_subject" /><br />
            <input type="text" placeholder="Email" name="user_email" /><br />
            <textarea rows="5" placeholder="Message" name="message" /><br />
            <button>Submit</button>
            {done && "Thank you, I will contact you as soon as possible"}

          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact