import { Data, Field, Form } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

const getStudents = async (formId: string) => {
  const res = await betterFetch<Form & { datas: Data[]; fields: Field[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/students-info/${formId}`
  );

  console.log("response: ", res);
  return res.data;
};

export const useGetStudents = (formId: string) => {
  return useQuery({
    queryKey: ["students", formId],
    queryFn: () => getStudents(formId),
  });
};
