import Footer from '../component/Footer';
import Header from '../component/Header';
import Mail from '../component/Mail';
import Title from '../component/Title';


const Contact = () => {
    
    return (
        <div>
            <Header />
                <body>
                    <Title name="Contact"/>
                    <Mail />
                </body>
            <Footer />
        </div>
    );
};

export default Contact;