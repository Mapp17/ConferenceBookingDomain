import  "./ConferenceBooking.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import BookingList from "./Components/BookingList";


function App() {
  return (
    <main className="appContainer">
      <Navbar/>

      <div className="gridContainer">
        <BookingList />
      </div>

      <Footer/>
    </main>
  );
}

export default App;
