import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'




const API = "http://65.108.148.136:8080/ToDo/"
const API_Img= "http://65.108.148.136:8080/images"
function Todo() {
  
  const [data, setData] = useState([])
  let [search, setSearch] = useState('')
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [idx, setIdx] = useState(null)
  const [modal, setModal] = useState(false)

  async function get() {
    try {
      let {data} = await axios.get(API + `get-to-dos`)
      setData(data.data)
    } catch (error) {
      console.log(error);
    }
  }

  async function searchUser(search) {
    try {
      let {data} = await axios.get(API + `get-to-dos?ToDoName=` + search )
      setData(data.data)
    } catch (error) {
      console.log(error);
    }
  }

  async function del(id) {
    try {
      let {data} = await axios.delete(API + "delete-to-do?id=" + id)
      get()
    } catch (error) {
      
    }
  }

  async function delImg(id) {
    try {
      let {data} = await axios.delete(API + "delete-to-do-image?imageId=" + id)
      get()
    } catch (error) {
      
    }
  }

  async function add(e) {
    e.preventDefault()
    let formData = new FormData();
    formData.append('name', e.target['name'].value)
    formData.append('description', e.target['desc'].value)
    let files = e.target['images'].files;
    if (files) {
     for (let i = 0; i < files.length; i++) {
       formData.append('images', files[i])
     }
    }
    try {
      let {data} = await axios.post(API + "add-to-do", formData)
      get()
      e.target['name'].value = ''
      e.target['desc'].value = ''
    } catch (error) {
      log.error(error)
    }
    }

    async function putUser(id) {
      try {
        let {data} = await axios.put(API + "update-to-do", {
          name: editName,
          description: editDesc,
          id: id
        })
        get()
      } catch (error) {
        console.log(error);
      }
    }

    async function check(id) {
      try {
        let {data} = await axios.put(`${API}is-completed?id=${id}`)
        get()
      } catch (error) {
        console.log(error);
      }
    }

  useEffect(()=> {
    get()
  },[])

  return (
    <>
     <div>
      <input type="text" name='search' value={search} onChange={(e)=> setSearch(e.target.value) }  />
      <button onClick={()=> searchUser(search)}>Submit</button>
      <form action="" onSubmit={add}>
        <input type="text" name="name" id="" placeholder='name' />
        <input type="text" name="desc" id="" placeholder='desc' />
        <input type="file" name='images' />
        <button type='submit'>Add</button>
      </form>
      <div>
      {data.map((el)=> {
        return (
          <div key={el.id}>
              {el.images.map((el)=> {
                return (
                  <div key={el.id}>
                    <img src={`${API_Img}/${el.imageName}`} />
                    <button onClick={()=> delImg(el.id)}>delete image</button>
                  </div>
                )
              })}
              <Link to={`/TodoId/${el.id}`}>
            <h1 className='underline text-[30px] text-[darkBlue]'>{el.name}</h1>
            </Link>
            <p>{el.description}</p>
            <button onClick={()=> {del(el.id)}}>delete</button>
            <button onClick={()=> {setModal(true), setEditDesc(el.description), setEditName(el.name), setIdx(el.id)}}>Edit</button>
            <input type="checkbox" name="" id="" onClick={()=> {check(el.id),console.log(data), el.isCompleted = !el.isCompleted}} checked={el.isCompleted} />
          </div>
        )
      })}
      {modal ? <div>
          <input type="text" name="name" value={editName} onChange={(e)=> setEditName(e.target.value)} />
          <input type="text" name="description" value={editDesc} onChange={(e)=> setEditDesc(e.target.value)} />
          <button type='submit' onClick={()=> {setModal(false),putUser(idx)}}>Edit</button>
      </div>: null}
      </div>
     </div>
    </>
  )


//   let API='http://65.108.148.136:8080/Category/'

//   const [data, setData] = useState([])

//   async function getCategory() {
//     try {
//       let {data} = await axios.get(API+ 'get-categories')
//       setData(data.data)
//     } catch (error) {
      
//     }
//   }

//   async function del(id) {
//     try {
//       let {data} = await axios.delete(API+ 'delete-category?id=' + id)
//       getCategory()
//     } catch (error) {
      
//     }
//   }

//   async function postUser() {
//     let formData = new FormData()
//     try {
//       let {data} = await axios.post(API+ 'add-category')
//       get()
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(()=> {
//     getCategory()
//   },[])

//   console.log(data);

//   return (
//     <>
//     <div>
//       <form action="" onSubmit={()=> postUser()}>
//         <input type="text" name="name" id="" />
//         <button type='submit'>Add</button>
//       </form>
//       {data.map((el)=> {
//         return (
//           <>
//           <div>
//             <h1>{el.name}</h1>
//             <button onClick={()=> del(el.id)}>delete</button>
//           </div>
//           </>
//         )
//       })}
//     </div>
//     </>
//   )
}

export default Todo
