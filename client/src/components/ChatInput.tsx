import Picker, { IEmojiData } from "emoji-picker-react";
import { FormEventHandler, useState } from "react";
import {BsEmojiSmileFill} from "react-icons/bs"
import {IoMdSend} from "react-icons/io"
import styled from "styled-components";

interface handleSendMsg {
  handleSendMsg : (msg:string) => void
} 

const ChatInput = ({ handleSendMsg} : handleSendMsg) => {
  const [msg, setMsg] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = ( e :any, emojiObject: IEmojiData) => {
    let message = msg
    message += emojiObject.emoji
    setMsg(message)
  }

  const sendChat:FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (msg.length > 0) {
      setShowEmojiPicker(false);
      handleSendMsg(msg)
      setMsg("")
    }
  }
  
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input type="text" placeholder="type yout message here" onChange={(e) => setMsg(e.target.value)} value={msg} />
        <button
          type="submit"
          style={{cursor: "pointer"}}>
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: rgb(243 244 246);
  padding: 0 2rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: #1f2937;
    gap: 1rem;

    button{
      cursor: pointer;
    }

    .emoji {
      position: relative;

      svg {
        font-size: 1.5rem;
        color: #facc15;
        cursor: pointer;
      }

      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #ffffff;
        box-shadow: 0 5px 10px #c7d2fe;
        border: 1px solid #c7d2fe;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #ffffff;
          width: 5px;

          &-thumb {
            background-color: #a5b4fc;
          }
        }

        .emoji-categories {
          button {
            filter: contrast(0.5);
          }
        }

        .emoji-search {
          background-color: transparent;
          border-color: #c7d2fe;
        }

        .emoji-group:before {
          background-color: #ffffff;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #e5e7eb;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: #1f2937;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #c7d2fe;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #6366f1;
      border: none;

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;

        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;


export default ChatInput