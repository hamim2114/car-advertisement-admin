import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Stack, IconButton, Avatar } from '@mui/material';
import { Close } from '@mui/icons-material';
import CTextField from '../../common/CTextField';
import CButton from '../../common/CButton';
import useAuth from '../../hook/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import toast from 'react-hot-toast';

const EditFaq = ({ data, onClose }) => {
  const [payload, setPayload] = useState({
    question: '',
    answer: '',
  });

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/faq/update/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['faq'])
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!payload.question) return toast.error('Question is required')
    if (!payload.answer) return toast.error('Answer is required')
    mutation.mutate(payload)
  };

  useEffect(() => {
    setPayload(data)
  }, [data])

  return (
    <Box>

      <Stack gap={2}>
        <CTextField
          topLabel="Question"
          size='small'
          name="question"
          value={payload.question}
          onChange={handleChange}
          required
        />
        <CTextField
          topLabel="Answer"
          size='small'
          multiline
          rows={8}
          name="answer"
          value={payload.answer}
          onChange={handleChange}
          required
        />
        <CButton loading={mutation.isPending} contained onClick={handleSave}>
          Update
        </CButton>
      </Stack>
    </Box >
  );
};

export default EditFaq;
