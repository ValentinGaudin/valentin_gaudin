import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import Swal from 'sweetalert2';


const Mail = () => {
    const form = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function sendmail(e) {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Your message has been sent',
            showConfirmButton: false,
            timer: 1500
            });
    
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
        <div>
            <form className="flex flex-col mx-auto" ref={form} onSubmit={sendmail}>
                <div className="form w-full">
                    <div className="mx-auto flex w-full">
                    <FormControl className="m-2 p-4 other flex mx-auto">
                            <InputLabel className="mt-2 " htmlFor="my-input">Name</InputLabel>
                                <Input required
                                    id="my-input"
                                    aria-describedby="my-helper-text"
                                    value={name}
                                    onChange={(e) => { e.preventDefault(); setName(e.target.value);}}
                                    name="name"
                                />
                        </FormControl>
                    </div>
                    <div className="mt-5 mx-auto flex w-full">
                        <FormControl className="m-2 p-4 other flex mx-auto">
                            <InputLabel className="mt-2" htmlFor="my-input">Email :</InputLabel>
                                <Input required
                                    id="my-input"
                                    aria-describedby="my-helper-text"
                                    value={email}
                                    onChange={(e) => { e.preventDefault(); setEmail(e.target.value);}}
                                    name="email"
                                />
                            <FormHelperText className="mb-4" id="my-helper-text">
                            I will not send share your mail.
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div className="mt-5 mx-auto flex w-full" >
                    <FormControl className="m-2 p-4 message flex mx-auto">
                            <InputLabel className="mt-2" htmlFor="my-input">Message :</InputLabel>
                                <Input required
                                    id="my-input"
                                    color="primary"
                                    aria-describedby="my-helper-text"
                                    value={message}
                                    onChange={(e) => { e.preventDefault(); setMessage(e.target.value);}}
                                    name="message"
                                />
                    </FormControl>
                        </div>
                        
                            <input 
                                className="mt-4 mb-4 button flex mx-auto"
                                value="Envoyer"
                                type="submit"
                            />
                    </div>
            </form>
        </div>
    );
};

export default Mail;