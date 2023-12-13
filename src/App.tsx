/* TODO:
  
  [X] Validação / transformação
  [X] Field Arrays
  [X] Upload de arquivos
  [ ] Composition Pattern

*/

import { useState } from 'react'
import './styles/global.css'

import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import supabase from './lib/supabase'

const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList)
    .transform(list => list.item(0)!)
    .refine(file => file.size <= 5 * 1024 * 1024, { message: 'Archive size up to 5mb' }),
  name: z.string()
    .min(1, { message: 'Name is necessary' })
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  email: z.string()
    .min(1, { message: 'Email is necessary' })
    .email({ message: 'Invalid email address' })
    .endsWith('@github.com', { message: 'Must be a valid GitHub email' }),
  password: z.string()
    .min(6, { message: 'Must be 6 or more characters long' }),
  techs: z.array(z.object({
    title: z.string().min(1, { message: 'Must have a title' }),
    knowledge: z.coerce.number().min(1).max(100),
  })).min(2, { message: 'At least 2 technologies is required' })
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [ output, setOutput ] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({
      title: '',
      knowledge: 0
    })
  }

  // High-order function like .map() reduce() find(). Passing a function to another function.
  async function createUser(data: CreateUserFormData) {
    await supabase.storage.from('react-advanced-form').upload(
      data.avatar.name, 
      data.avatar
    )

    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className='h-screen py-10 bg-zinc-950 flex flex-col gap-10 items-center justify-center text-zinc-300 '>
      <form onSubmit={handleSubmit(createUser)} className="flex flex-col gap-4 w-full max-w-xs">
        <div className='flex flex-col gap-1'>
          <label htmlFor="avatar">Avatar</label>
          <input 
            type="file"
            accept='image/*'
            {...register('avatar')}
          />
          {errors.avatar && <span className='text-red-600 text-sm'>{errors.avatar.message}</span>}
        </div>
       
       <div className='flex flex-col gap-1'>
          <label htmlFor="name">Name</label>
          <input 
            type="string"
            className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
            {...register('name')}
          />
          {errors.name && <span className='text-red-600 text-sm'>{errors.name.message}</span>}
        </div>
        
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email"
            className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
            {...register('email')}
          />
          {errors.email && <span className='text-red-600 text-sm'>{errors.email.message}</span>}
        </div>
        
        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
            {...register('password')}
          />
          {errors.password && <span className='text-red-600 text-sm'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1 py-2'>
          <label htmlFor="password" className='flex items-center justify-between'>
            Technologies

            <button 
              type='button'
              onClick={addNewTech}
              className='text-emerald-500 text-sm'
            >
              + Add
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className='flex items-center gap-2 py-1' key={field.id}>
                <div className='flex-1 flex flex-col gap-1'>
                  <input 
                    type="text" 
                    className='border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && <span className='text-red-600 text-sm'>{errors.techs?.[index]?.title?.message}</span>}
                </div>

                <div className='flex flex-col gap-1'>
                  <input 
                    type="number" 
                    className='w-16 border border-zinc-700 shadow-sm rounded h-10 px-3 bg-zinc-800'
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className='text-red-600 text-sm'>{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>

                <X 
                  onClick={() => remove(index)} 
                  size={18}
                  className='text-red-500 cursor-pointer'
                />
              </div>
            )
          })}

          {errors.techs && <span className='text-red-600 text-sm'>{errors.techs.message}</span>}
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
