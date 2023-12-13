import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  `${process.env.PROJECT_URL}`,
  `${process.env.SECRET_SERVICE_ROLE}`
)