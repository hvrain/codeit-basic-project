import { deleteMessage, getMessagesByRecipientId, deleteRecipients } from 'api';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as S from 'styles/styled/PostId';
import PlusImage from 'assets/images/Enabled@2x.png';
import getUrlInfo from 'utils/getUrlInfo';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipientMessage from './RecipientMessage';
import Modal from './Modal';

function RecipientMessageList({ id }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const target = useRef();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    const urlInfo = getUrlInfo(nextCursor);
    if (urlInfo) {
      const { url, params } = urlInfo;
      params.limit = 6;
      const { data } = await axios.get(url, {
        params,
      });
      setMessages(prev => prev.concat(data.results));
      setNextCursor(data.next);
      setIsLoading(false);
    }
  }, [nextCursor]);

  useEffect(() => {
    const { current } = target;
    const handleObserve = entries => {
      const { isIntersecting } = entries[0];
      if (isIntersecting) setIsLoading(true);
    };
    const observer = new IntersectionObserver(handleObserve);
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [messages]);

  useEffect(() => {
    if (isLoading && nextCursor) fetchMessages();
  }, [isLoading, nextCursor, fetchMessages]);

  useEffect(() => {
    const handleLoad = async () => {
      const { data } = await getMessagesByRecipientId({
        recipientId: id,
        offset: 0,
        limit: 5,
      });
      setMessages(() => data.results);
      setNextCursor(() => data.next);
    };

    handleLoad();
  }, [id]);

  const onModalOpen = message => {
    setModalMessage(message);
  };

  const onModalClose = () => {
    setModalMessage(null);
  };

  const [isEdit] = useState(pathname.startsWith('/post') && pathname.endsWith('/edit'));

  return (
    <S.Container>
      <div>
        {isEdit && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() =>
                deleteRecipients({ id }).then(() => {
                  navigate('/post');
                })
              }
              style={{
                position: 'absolute',
                right: '0',
                // top: '-11px',

                padding: '7px 17px',
                borderRadius: '6px',
                background: '#9935FF',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '26px',
                letterSpacing: '-0.01em',
                textAlign: 'center',
                color: '#FFFFFF',
              }}>
              삭제하기
            </button>
          </div>
        )}

<S.MessageList>
        {messages?.map(message => {
          if (isEdit) {
            return (
              <RecipientMessage
                onModal={onModalOpen}
                key={message.id}
                message={message}
                isEdit={isEdit}
                onClickTrashBtn={() => deleteMessage({ messageId: message.id })}
              />
            );
          }
          return <RecipientMessage onModal={onModalOpen} key={message.id} message={message} />;
        })}

        <div ref={target} />
      </S.MessageList>
      {modalMessage && createPortal(<Modal value={modalMessage} onModalClose={onModalClose} />, document.body)}
    </S.Container>
  );
}

export default RecipientMessageList;