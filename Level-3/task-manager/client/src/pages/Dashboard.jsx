import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PlusIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  SparklesIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchTerm, filter, sortBy]);

  useEffect(() => {
    if (tasks.length > 0) {
      const completed = tasks.filter(t => t.completed).length;
      setStats({
        total: tasks.length,
        completed,
        pending: tasks.length - completed,
        completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
      });
    } else {
      setStats({ total: 0, completed: 0, pending: 0, completionRate: 0 });
    }
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'completed':
          return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      const response = await API.post('/tasks', newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
      setShowAddForm(false);
      toast.success('Task created successfully! ✨');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await API.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
      toast.success(task.completed ? 'Task unmarked' : 'Task completed! 🎉');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await API.put(`/tasks/${id}`, updates);
      setTasks(tasks.map(t => t._id === id ? response.data : t));
      toast.success('Task updated successfully! ✏️');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setSortBy('newest');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
      </div>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="fixed w-1 h-1 bg-white/10 rounded-full"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Main content - using a div instead of fragment to avoid ref issues */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-2 animate-float">
                  <SparklesIcon className="w-full h-full text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text">
                  TaskFlow
                </h1>
              </motion.div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchTasks}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300 border border-white/10"
                  title="Refresh tasks"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </motion.button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-3 px-4 py-2 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10"
                >
                  <UserCircleIcon className="w-6 h-6 text-purple-400" />
                  <span className="text-white font-medium hidden sm:block">
                    {user?.name}
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300 border border-white/10"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="hidden sm:block">Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Total Tasks', 
                value: stats.total, 
                icon: ChartBarIcon, 
                gradient: 'from-blue-500 to-cyan-500',
                bg: 'from-blue-500/20 to-cyan-500/20'
              },
              { 
                label: 'Completed', 
                value: stats.completed, 
                icon: CheckCircleIcon, 
                gradient: 'from-green-500 to-emerald-500',
                bg: 'from-green-500/20 to-emerald-500/20'
              },
              { 
                label: 'Pending', 
                value: stats.pending, 
                icon: ClockIcon, 
                gradient: 'from-orange-500 to-red-500',
                bg: 'from-orange-500/20 to-red-500/20'
              },
              { 
                label: 'Completion Rate', 
                value: `${stats.completionRate || 0}%`, 
                icon: ChartBarIcon, 
                gradient: 'from-purple-500 to-pink-500',
                bg: 'from-purple-500/20 to-pink-500/20'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 bg-gradient-to-br ${stat.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-3 animate-float`}>
                    <stat.icon className="w-full h-full text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                    showFilters || filter !== 'all' || sortBy !== 'newest'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  <FunnelIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">New Task</span>
                </motion.button>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex flex-wrap gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400">Status</label>
                          <div className="flex gap-2">
                            {['all', 'pending', 'completed'].map((f) => (
                              <motion.button
                                key={f}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg capitalize text-sm transition-all ${
                                  filter === f
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                              >
                                {f}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-gray-400">Sort by</label>
                          <div className="flex gap-2">
                            {['newest', 'oldest', 'title', 'completed'].map((s) => (
                              <motion.button
                                key={s}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSortBy(s)}
                                className={`px-3 py-1.5 rounded-lg capitalize text-sm transition-all ${
                                  sortBy === s
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                              >
                                {s}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {(filter !== 'all' || sortBy !== 'newest' || searchTerm) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={clearFilters}
                          className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Clear filters
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Task Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Create New Task</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      autoFocus
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <div className="flex justify-end gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
                      >
                        Create Task
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tasks Grid */}
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-32 h-32 mx-auto mb-6 text-gray-400 animate-float">
                  <SparklesIcon className="w-full h-full" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No tasks found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || filter !== 'all' || sortBy !== 'newest'
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started!'}
                </p>
                {!showAddForm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl inline-flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Your First Task
                  </motion.button>
                )}
              </motion.div>
            ) : (
              // Changed from fragment to div to avoid ref issues
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-400">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </p>
                </div>
                <motion.div
                  layout
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;