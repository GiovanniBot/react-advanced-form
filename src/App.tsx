/* TODO:
  
  [ ] Validação / transformação
  [ ] Field Arrays
  [ ] Upload de arquivos
  [ ] Composition Pattern

*/

import { useState } from 'react'
import './styles/global.css'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z.string()
    .min(1, { message: 'Name is necessary' })
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  email: z.string()
    .min(1, { message: 'Email is necessary' })
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Must be 6 or more characters long' }),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [ output, setOutput ] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors } 
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })

  console.log(errors)

  // High-order function like .map() reduce() find(). Passing a function to another function.
  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className='h-screen bg-zinc-950 flex flex-col gap-10 items-center justify-center text-zinc-300 '>
      <form onSubmit={handleSubmit(createUser)} className="flex flex-col gap-4 w-full max-w-xs">
       <div className='flex flex-col gap-1'>
          <label htmlFor="name">Name</label>
          <input 
            type="string"
            className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
            {...register('name')}
          />
          {errors.name && <span className='text-red-600 text-xs'>{errors.name.message}</span>}
        </div>
        
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email"
            className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
            {...register('email')}
          />
          {errors.email && <span className='text-red-600 text-xs'>{errors.email.message}</span>}
        </div>
        
        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
            {...register('password')}
          />
          {errors.password && <span className='text-red-600 text-xs'>{errors.password.message}</span>}
        </div>

        <button 
          type='submit'
          className='bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-white h-10'
        >
          Enter
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}

export default App
