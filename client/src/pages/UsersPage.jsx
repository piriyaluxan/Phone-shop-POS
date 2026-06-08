import { useState, useEffect } from 'react';
import { useSelector }         from 'react-redux';
import {
  fetchUsersApi, createUserApi, updateUserApi, deleteUserApi,
} from '../api/userApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import Modal           from '../components/common/Modal';
import ConfirmDialog   from '../components/common/ConfirmDialog';
import Badge           from '../components/common/Badge';
import { formatDate }  from '../utils/format';

const emptyForm = { name: '', password: '', role: 'retail_operator', customUserId: '', isActive: true };

const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all';

const UsersPage = () => {
  const { user: me }   = useSelector((s) => s.auth);
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modalMode,    setModalMode]    = useState(null);  // 'create' | 'edit' | 'delete' | 'reset'
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState(emptyForm);
  const [formLoading,  setFormLoading]  = useState(false);
  const [formError,    setFormError]    = useState('');
  const [newPassword,  setNewPassword]  = useState('');

  const load = () => {
    setLoading(true);
    fetchUsersApi()
      .then((r) => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (u) => {
    setSelected(u);
    setForm({ name: u.name, password: '', role: u.role, customUserId: u.userId, isActive: u.isActive });
    setFormError('');
    setModalMode('edit');
  };

  const openDelete = (u) => { setSelected(u); setModalMode('delete'); };

  const openReset = (u) => { setSelected(u); setNewPassword(''); setModalMode('reset'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); setFormError('');
    try {
      if (modalMode === 'create') {
        await createUserApi({ name: form.name, password: form.password, role: form.role, customUserId: form.customUserId || undefined });
      } else {
        const payload = { name: form.name, isActive: form.isActive };
        if (form.password) payload.password = form.password;
        await updateUserApi(selected._id, payload);
      }
      setModalMode(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try { await deleteUserApi(selected._id); setModalMode(null); load(); }
    catch (err) { console.error(err); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateUserApi(selected._id, { password: newPassword });
      setModalMode(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed');
    } finally { setFormLoading(false); }
  };

  const admins    = users.filter((u) => u.role === 'admin');
  const operators = users.filter((u) => u.role === 'retail_operator');

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark">User Management</h2>
          <p className="font-body text-gray-500 text-sm mt-0.5">
            {admins.length} admin{admins.length !== 1 ? 's' : ''} · {operators.length} retail operator{operators.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate}
          className="px-5 py-2.5 bg-primary hover:bg-blue-900 text-white font-heading font-semibold rounded-xl transition-colors shadow-lg shadow-primary/20 text-sm">
          + Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      ) : (
        <div className="space-y-6">
          {[
            { label: 'Administrators', list: admins,    color: 'primary' },
            { label: 'Retail Operators', list: operators, color: 'success' },
          ].map(({ label, list, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-5 py-3.5 border-b border-gray-100 flex items-center gap-2`}>
                <span className={`w-2 h-2 rounded-full ${color === 'primary' ? 'bg-primary' : 'bg-success'}`} />
                <h3 className="font-heading font-semibold text-dark">{label}</h3>
                <span className="ml-auto font-body text-xs text-gray-400">{list.length} account{list.length !== 1 ? 's' : ''}</span>
              </div>

              {list.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="font-body text-gray-400 text-sm">No {label.toLowerCase()} yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {list.map((u) => (
                    <div key={u._id} className="px-5 py-4 flex items-center gap-4 hover:bg-surface/40 transition-colors">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading font-bold text-white flex-shrink-0 ${
                        color === 'primary' ? 'bg-primary' : 'bg-success'
                      }`}>
                        {u.name[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-body font-semibold text-dark text-sm">{u.name}</p>
                          <span className="font-mono text-xs text-primary bg-blue-50 px-2 py-0.5 rounded font-bold">
                            {u.userId}
                          </span>
                          {!u.isActive && <Badge label="Inactive" variant="danger" dot />}
                          {u._id === me?._id && (
                            <span className="text-xs font-body text-gray-400 bg-surface px-2 py-0.5 rounded">You</span>
                          )}
                        </div>
                        <p className="font-body text-xs text-gray-400 mt-0.5">
                          Created {formatDate(u.createdAt)}
                          {u.createdBy && ` by ${u.createdBy.name}`}
                        </p>
                      </div>

                      {/* Actions — can't modify yourself */}
                      {u._id !== me?._id && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button onClick={() => openReset(u)}
                            className="px-3 py-1.5 bg-surface hover:bg-gray-200 text-dark font-body text-xs font-semibold rounded-lg transition-colors"
                            title="Reset password">
                            🔑 Reset PW
                          </button>
                          <button onClick={() => openEdit(u)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-primary transition-colors"
                            title="Edit">✏️</button>
                          <button onClick={() => openDelete(u)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete">🗑️</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Add New User' : `Edit — ${selected?.userId}`}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">
              ⚠ {formError}
            </div>
          )}

          <div>
            <label className="block font-body font-medium text-sm text-dark mb-1.5">Full Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Operator" required className={inp} />
          </div>

          {modalMode === 'create' && (
            <>
              <div>
                <label className="block font-body font-medium text-sm text-dark mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inp}>
                  <option value="retail_operator">Retail Operator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block font-body font-medium text-sm text-dark mb-1.5">
                  Custom User ID <span className="text-gray-400 font-normal">(optional — auto-generated if blank)</span>
                </label>
                <input value={form.customUserId}
                  onChange={(e) => setForm({ ...form, customUserId: e.target.value.toUpperCase() })}
                  placeholder="e.g. OP-005" className={`${inp} font-mono uppercase`} />
              </div>
              <div>
                <label className="block font-body font-medium text-sm text-dark mb-1.5">Password *</label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters" required className={inp} />
              </div>
            </>
          )}

          {modalMode === 'edit' && (
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div>
                <p className="font-body font-medium text-dark text-sm">Account Active</p>
                <p className="font-body text-xs text-gray-400">Inactive users cannot log in</p>
              </div>
              <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-success' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalMode(null)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body text-sm text-dark hover:bg-surface transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={formLoading}
              className="flex-1 py-2.5 bg-primary text-white font-heading font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm">
              {formLoading ? 'Saving…' : modalMode === 'create' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Password Reset Modal */}
      <Modal isOpen={modalMode === 'reset'} onClose={() => setModalMode(null)}
        title={`Reset Password — ${selected?.userId}`} size="sm">
        <form onSubmit={handleResetPassword} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">⚠ {formError}</div>
          )}
          <div className="bg-surface rounded-xl px-4 py-3 font-body text-sm text-gray-600">
            Setting a new password for <strong>{selected?.name}</strong> ({selected?.userId}).
            They will need to use this new password on their next login.
          </div>
          <div>
            <label className="block font-body font-medium text-sm text-dark mb-1.5">New Password *</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters" required minLength={6} className={inp} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setModalMode(null)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body text-sm text-dark hover:bg-surface transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={formLoading}
              className="flex-1 py-2.5 bg-warning text-white font-heading font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm">
              {formLoading ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={modalMode === 'delete'}
        onCancel={() => setModalMode(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`"${selected?.name}" (${selected?.userId}) will be permanently deleted. This cannot be undone.`}
      />
    </DashboardLayout>
  );
};

export default UsersPage;