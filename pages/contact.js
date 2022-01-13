import Footer from '../components/Footer';
import Header from '../components/Header';
import Mail from '../components/Mail';
import Title from '../components/Title';


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