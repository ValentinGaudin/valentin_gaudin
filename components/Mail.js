import { useState, useRef } from "react";
import emailjs from "emailjs-com";

const Mail = () => {
    const form = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function sendmail(e) {
        e.preventDefault();
        alert("Merci, vous serez recontacté d’ici peu");
    
        emailjs
            .sendForm(
                "service_qep2e6i",
                "template_pmx2huh",
                form.current,
                "user_RXtoG9ZosYD7S1MPiODOU"
            )
            .then(
                (result) => {
                console.log(result.text);
                setEmail(""), setMessage("");
                },
                (error) => {
                console.log(error.text);
                }
            )
        
            e.target.reset();
        }

    return (
        <div >

                <h4 className="text-2xl text-center"> <span></span> Contact</h4>
                <form className="p-4 m-2 gap-5" ref={form} onSubmit={sendmail}>
                    <div className="form flex flex-col">
                        <div>
                        <label htmlFor="email"> Your name </label>
                            <input
                                type="text"
                                className="rounded-md mt-5 flex"
                                value={name}
                                onChange={(e) => { e.preventDefault(); setName(e.target.value); }}
                                name="name"
                            />
                        </div>
                        <div className="pb-4">
                        <label htmlFor="message"> Your mail </label>
                            <input
                                type="text"
                                className="rounded-md mt-5 flex"
                                value={email}
                                onChange={(e) => { e.preventDefault(); setEmail(e.target.value); }}
                                name="email"
                            />
                        </div>
                        <div className="pb-4">
                        <label htmlFor="message"> Your message </label>
                            <input
                                type="textarea"
                                className="rounded-md mt-5 flex"
                                value={message}
                                onChange={(e) => { e.preventDefault(); setMessage(e.target.value); }} 
                                name="message"
                            />
                        </div>
                            <input 
                                className="rounded-md p-2"
                                value="Envoyer"
                                type="submit"
                            />
                    </div>
                </form>

        </div>
    );
};

export default Mail;