import type { Form, Data } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { betterFetch } from "@better-fetch/fetch"

const getForms = async () => {
  console.log("Fetching forms...")

  // Instead of: `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/get`
  // Just use: "/api/forms/get"
  const res = await betterFetch<Form[]>("/api/forms/get")

  console.log("Forms response: ", res)
  return res.data
}

export const useGetForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: () => getForms(),
  })
}

const addData = async (data: { datas: JSON; formId: string }) => {
  console.log("Adding data:", data)

  // Instead of: `${process.env.NEXT_PUBLIC_BASE_URL}/api/submission`
  // Just use: "/api/submission"
  const { data: newUser, error } = await betterFetch<Data>("/api/submission", {
    method: "POST",
    body: {
      data: data.datas,
      formId: data.formId,
    },
  })

  if (newUser) {
    return newUser
  }
  if (error) {
    throw new Error(error.message)
  }
}

export const useAddData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { datas: JSON; formId: string }) => addData(data),
    onSuccess: () => {
      console.log("invalidating queries")
      queryClient.invalidateQueries({ queryKey: ["datas"] })
      queryClient.invalidateQueries({ queryKey: ["forms"] })
    },
  })
}
