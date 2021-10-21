import styles from './App.module.scss'
import { LoginBox } from './components/LoginBox'
import { MessageList } from './components/MessageList'
import { SendMessageForm } from './components/SendMessageForm'
import { useAuth } from './hooks/useAuth';

export function App() {
  const { user, isLoading } = useAuth();
  //console.log('user = ', user);
  //console.log('isLoading = ', isLoading);
  return (
    <div className="App">
      <main className={`${(isLoading) ? styles.contentWrapper : styles.contentSigned }`} >
        <MessageList />
        { (isLoading) ? <SendMessageForm /> : <LoginBox /> }
      </main>
    </div>
  )
}

