import styles from './App.module.scss'
import { LoginBox } from './components/LoginBox'
import { MessageList } from './components/MessageList'
import { SendMessageForm } from './components/SendMessageForm'
import { useAuth } from './hooks/useAuth';

export function App() {
  const { user, isSigningIn } = useAuth();
  return (
    <div className="App">
      <main className={`${(isSigningIn) ? styles.contentSigned : styles.contentWrapper}`} >
        <MessageList />
        { (isSigningIn) ? <SendMessageForm /> : <LoginBox /> }
      </main>
    </div>
  )
}

