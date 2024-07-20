/* eslint-disable */
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

import FromNameInput from '../components/PostIdMessagePageComponents/FromNameInput';
import ProfileImgInputSelector from '../components/PostIdMessagePageComponents/ProfileImgInputSelector';
import TextContentBox from '../components/PostIdMessagePageComponents/TextContentBox';
import RelationshipAndFontSelector from '../components/PostIdMessagePageComponents/RelationshipAndFontSelector';
import { createMessage } from '../api/someApi';

const PostIdMessage = () => {
  const [recipientId, setRecipientId] = useState('');
  const [sender, setSender] = useState('');
  const [profileImageURL, setProfileImageURL] = useState(
    'https://ibb.co/cvKLyF5',
  );
  const [relationship, setRelationship] = useState('');
  const [content, setContent] = useState('');
  const [font, setFont] = useState('');
  const navigate = useNavigate();

  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = {
      team: '8-5',
      recipientId: id,
      sender,
      profileImageURL,
      relationship,
      content,
      font,
    };

    await createMessage(messageData);
    navigate(`/post/${id}`);
  };

  const isButtonDisabled = !sender || !content;

  return (

  );
}

export default PostIdMessage;
