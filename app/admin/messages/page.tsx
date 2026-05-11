import { MessageSquare, Send, Inbox, Archive } from 'lucide-react'

export default function MessagesPage() {
  // Placeholder data - will be connected to real messaging system later
  const messages = [
    {
      id: 1,
      from: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Question sur le cours de Tajweed',
      preview: 'Bonjour, j\'aimerais savoir si le cours inclut des exercices pratiques...',
      date: '2024-01-15',
      read: false,
    },
    {
      id: 2,
      from: 'Marie Martin',
      email: 'marie@example.com',
      subject: 'Problème de paiement',
      preview: 'J\'ai essayé de m\'inscrire mais le paiement ne passe pas...',
      date: '2024-01-14',
      read: false,
    },
    {
      id: 3,
      from: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      subject: 'Demande de certificat',
      preview: 'J\'ai terminé le cours mais je n\'ai pas reçu mon certificat...',
      date: '2024-01-13',
      read: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">Gérez les messages des utilisateurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Inbox className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Boîte de réception</p>
              <p className="text-2xl font-bold text-slate-900">{messages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Non lus</p>
              <p className="text-2xl font-bold text-slate-900">
                {messages.filter(m => !m.read).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Envoyés</p>
              <p className="text-2xl font-bold text-slate-900">45</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Archive className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Archivés</p>
              <p className="text-2xl font-bold text-slate-900">128</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Messages Récents</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all">
            <Send className="w-4 h-4" />
            Nouveau Message
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer ${
                !message.read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {message.from.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`text-sm font-bold ${!message.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {message.from}
                      </p>
                      <p className="text-xs text-slate-600">{message.email}</p>
                    </div>
                    <span className="text-xs text-slate-600 flex-shrink-0 ml-4">
                      {new Date(message.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${!message.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                    {message.subject}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-1">{message.preview}</p>
                  {!message.read && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      Nouveau
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Système de messagerie complet à venir
            </h3>
            <p className="text-slate-600">
              Un système de messagerie en temps réel avec notifications sera bientôt disponible
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
