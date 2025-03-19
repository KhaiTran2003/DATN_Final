import { useEffect, useState } from "react";
import SidebarAdmin from "../SidebarAdmin";
import NavbarAdmin from "../NavbarAdmin";
import axios from "axios";
import Table from "../../compunents/Table";




const ListLesson = () =>{

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [ListLesson,setListLesson ] = useState([])
    const [displayList, setDisplayList] = useState([])
    const [isInit,setisInit] = useState(false)
    useEffect (()=>{
        async function getAllListLesson(){
            try {
                const response = await axios.get('http://localhost:5000/api/lessons');
                setListLesson(response.data)

                const testlist = [{'id_lesson': 1,'title': 'test', 'description':'testtesttest',
                    'duaration':120,'image':'test','course_id':1,'course_title':'test','fullname':'test'},
                    {'id_lesson': 2,'title': 'dfas', 'description':'43214','duaration':130,
                        'image':'treqwrwest','course_id':2,'course_title':'dsafsafsa','fullname':'reqwre'}]

                setListLesson(testlist)


                setDisplayList(format(testlist))
              } catch (err) {
                console.log('Có lỗi khi lấy dữ liệu khóa học.',err);
              } 
            
        }
        getAllListLesson()
    },[])
    function format (list){
        return  list.map(item => ({
            title: item.title,
            duaration: item.duaration,
            image: item.image,
            'course title': item.course_title, // đổi tên course_title thành courseTitle
            teacher: item.fullname          // đổi tên fullname thành teacher
          }))
          
    }
    const toggleSidebar = () => { 
        setIsSidebarOpen(!isSidebarOpen);
      };
      function handleOnChange(event){
        //search lessson
        console.log(2)
        const keyword = event.target.value
        setDisplayList(format(filteredList(keyword)))
        
      }
      const filteredList = (keyword) => {
        const filteredList = keyword.trim() === ''
        ? ListLesson
        : ListLesson.filter(item => {
            const lowerKeyword = keyword.toLowerCase();
            return (
                item.title.toLowerCase().includes(lowerKeyword) ||
                item.duaration.toString().toLowerCase().includes(lowerKeyword) ||
                item.image.toLowerCase().includes(lowerKeyword) ||
                item.course_title.toLowerCase().includes(lowerKeyword) ||
                item.fullname.toLowerCase().includes(lowerKeyword)
            );
            });
        return filteredList
    }
    function handleOnClick(){
        
    }
    return(<>
        <div className="flex items-center relative h-[100vh]">
            <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="ml-[250px] mt-[170px] w-full h-[80%] items-start">
                <NavbarAdmin handleOnChange={handleOnChange}/>  
                <button className="bg-black text-white">them moi</button>
                <div className="mt-[40px] mx-[40px] items-center w-[90%] h-full">
                    <Table data={displayList} handleOnChange = {handleOnClick}/>
                </div>             
            </div>

        </div>

    </>)
}

export default ListLesson;