import React from 'react'
import AiInput from '@/components/ui/ai-input'
import { UserCircle } from 'lucide-react'

const page = () => {
  return (
    <section className='h-[calc(100dvh-69px-16px)] overflow-y-scroll overflow-x-hidden pt-2 sm:pt-4 px-2 sm:px-4 w-full md:max-w-3xl mx-auto relative scrollbar-hide'>
      <div className="chat-container">
        <div className="chat-messages">
          {/* Other user message (left side) */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>

          {/* Current user message (right side) */}
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
          <div className="message-user">
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <div className="message-avatar-secondary">
              U
            </div>
          </div>

          {/* Another other user message */}
          <div className="message-other">
            <div className="message-avatar-primary">
              N
            </div>
            <p className="message-text">
              Another message from the other user.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-3xl z-10 px-2 sm:px-0">
        <AiInput />
      </div>
    </section>
  )
}

export default page