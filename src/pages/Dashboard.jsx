import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const { user, logout, requests } = useAuth();
  const navigate = useNavigate();

  // Statistics Calculation
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeCount = requests.filter(r => r.status === 'accepted' || r.status === 'ongoing').length;
  const completedCount = requests.filter(r => r.status === 'closed').length;

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[200px] -z-10 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-300/10 rounded-full blur-[200px] -z-10 opacity-30"></div>

      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── HEADER SECTION ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.avatar || "https://api.dicebear.com/8.x/adventurer/svg?seed=Felix"}
                alt="Profile"
                className="w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-800 shadow-xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800 dark:text-white">Hello, {user?.name}! 👋</h1>
              <p className="text-gray-500 font-medium">Welcome back to your learning hub.</p>
              <div className="flex gap-4 mt-3">
                <button onClick={() => navigate('/edit-profile')} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">Edit Profile</button>
                <button onClick={logout} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Logout</button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {[
              { label: 'Pending', count: pendingCount, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
              { label: 'Active', count: activeCount, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' },
              { label: 'Completed', count: completedCount, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} px-6 py-3 rounded-2xl flex flex-col items-center min-w-[100px] shadow-sm`}>
                <span className="text-xl font-black">{stat.count}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── LEFT COLUMN: WALLET & FEEDBACK ── */}
          <div className="lg:col-span-4 space-y-10">

            {/* 💰 PREMIUM WALLET CARD */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group animate-in zoom-in duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Balance</p>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-5xl font-black text-white">{user?.coins || 0}</span>
                  <span className="text-2xl text-white/50 font-bold">Coins</span>
                </div>

                <div className="space-y-4">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2">Recent Activity</p>
                  {user?.transactions?.length > 0 ? (
                    user.transactions.slice(-3).reverse().map((tx, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-white/70">{tx.type}</span>
                        <span className={`font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-300'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/30 text-xs italic">No transactions yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* 🔥 STREAK MAINTENANCE CARD */}
            <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group animate-in slide-in-from-left duration-700 delay-200">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1">Current Streak</p>
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-black text-white">{user?.streak?.count || 1}</span>
                      <span className="text-3xl animate-bounce">🔥</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1">Personal Best</p>
                    <p className="text-xl font-black text-white">{user?.streak?.best || 1}</p>
                  </div>
                </div>

                {/* Progress to next 7-day bonus */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-white/80 uppercase">Progress to Bonus</p>
                    <p className="text-xs font-black text-white">
                      {(user?.streak?.count % 7)}/7 <span className="text-white/50 text-[10px] font-medium">Days</span>
                    </p>
                  </div>
                  <div className="h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000 shadow-sm shadow-white/50"
                      style={{ width: `${((user?.streak?.count % 7) / 7) * 100 || 14}%` }}
                    ></div>
                  </div>
                  <p className="text-[9px] text-orange-50 font-medium italic opacity-80 text-center">
                    {7 - (user?.streak?.count % 7)} more days to earn +50 Coins! 💰
                  </p>
                </div>
              </div>
            </div>

            {/* 🌟 LATEST FEEDBACK */}
            <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-gray-800 dark:text-gray-300 uppercase text-[10px] tracking-widest">Latest Feedback</h3>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs">⭐ {user?.averageRating || '0.0'}</span>
              </div>

              <div className="space-y-6">
                {user?.reviews?.length > 0 ? (
                  user.reviews.slice(0, 2).map((rev, i) => (
                    <div key={i} className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-white/50 dark:border-white/5">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{rev.reviewerName}</span>
                        <span className="text-amber-500 text-[10px]">{'⭐'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-xs text-gray-500 italic">"{rev.comment || 'No comment provided'}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4 italic">No reviews yet. Start teaching to build your reputation!</p>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: TASKS & QUICK ACTIONS ── */}
          <div className="lg:col-span-8 space-y-10">

            {/* 🚀 GETTING STARTED GUIDE */}
            {completedCount === 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-[3rem] border border-amber-100 dark:border-amber-900/20 shadow-sm animate-in slide-in-from-right-4 duration-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-amber-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">🚀</div>
                  <div>
                    <h3 className="font-black text-amber-900 dark:text-amber-100 leading-none mb-1">Getting Started</h3>
                    <p className="text-amber-700/60 dark:text-amber-400/60 text-xs font-bold">Complete these steps to earn your first badge!</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { step: '1', task: 'Complete your profile', done: !!user?.bio },
                    { step: '2', task: 'Find a skill partner', done: requests.length > 0 },
                    { step: '3', task: 'Complete your first session', done: completedCount > 0 },
                    { step: '4', task: 'Earn your first review', done: user?.reviews?.length > 0 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-white dark:border-white/5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${item.done ? 'bg-emerald-500 text-white' : 'bg-amber-200 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'}`}>
                        {item.done ? '✓' : item.step}
                      </div>
                      <span className={`text-xs font-bold ${item.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 📋 ACTIVE SESSIONS QUICK VIEW */}
            <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-lg min-h-[400px]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-gray-800 dark:text-white">Recent Sessions</h3>
                <button onClick={() => navigate('/requests')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">View All</button>
              </div>

              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.slice(0, 4).map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-5 bg-white/50 dark:bg-gray-800/30 rounded-3xl border border-white/50 dark:border-white/5 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <img src={req.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="text-sm font-black text-gray-800 dark:text-gray-200">{user?.name === req.from ? req.to : req.from}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.requestedSkill}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${req.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                            req.status === 'ongoing' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 animate-pulse' :
                              'bg-emerald-50 border-emerald-200 text-emerald-600'
                          }`}>
                          {req.status}
                        </span>
                        <p className="text-[10px] text-gray-300 mt-1">{req.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <div className="text-5xl mb-6 opacity-20">🎯</div>
                  <h4 className="font-bold text-gray-400 mb-2">No session history yet</h4>
                  <button onClick={() => navigate('/find-skills')} className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest hover:underline">Find your first partner ↗</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
