import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  CalendarIcon,
  FlagIcon 
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';

const TaskCard = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-yellow-500 to-orange-400',
    low: 'from-green-500 to-emerald-500'
  };

  const handleUpdate = () => {
    if (editedTitle.trim()) {
      onUpdate(task._id, { title: editedTitle, description: editedDescription });
      setIsEditing(false);
    }
  };

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-300 ${
        task.completed 
          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
          : 'bg-white/5 border-white/10 hover:border-purple-500/50'
      }`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-orange-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-orange-500/10 transition-all duration-500"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggle(task)}
              className="focus:outline-none"
            >
              {task.completed ? (
                <CheckCircleSolid className="w-6 h-6 text-green-400" />
              ) : (
                <CheckCircleIcon className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
              )}
            </motion.button>

            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-purple-500"
                autoFocus
              />
            ) : (
              <h3 className={`text-lg font-semibold flex-1 ${
                task.completed ? 'line-through text-gray-400' : 'text-white'
              }`}>
                {task.title}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!task.completed && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(task._id)}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Description (collapsible) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  onBlur={handleUpdate}
                  className="w-full mt-3 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Add description..."
                  rows="3"
                />
              ) : (
                task.description && (
                  <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                    {task.description}
                  </p>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            {task.priority && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${priorityColors[task.priority]} bg-opacity-20`}>
                <FlagIcon className="w-3 h-3" />
                <span className="capitalize">{task.priority}</span>
              </div>
            )}
          </div>
          
          {task.completed && task.completedAt && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircleIcon className="w-3 h-3" />
              <span>Completed {formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar for completed tasks */}
      {task.completed && (
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400"
        />
      )}
    </motion.div>
  );
};

export default TaskCard;