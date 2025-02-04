// import Image from "next/image";
import Sidebar from "./components/sidebar";
import Popup from "./components/Popup";
import Container from "./Container/container";
import Dashboard from "./Dashboard/dashboard";
import Managetable from "./Managetable/managetable";


export default function Home() {
  return (
  <div>
     <Popup mainBoardId={""} closeModal={function (): void {
        throw new Error("Function not implemented.");
      } } onSubmit={() => Promise.resolve()}/>
    <Sidebar/>
    <Container/>
    <Dashboard/>
    <Managetable boardId={""}/>
    
  </div>
  )
}