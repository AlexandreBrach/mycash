from comptes.models import State

class StateService:

    def retrieve_state_row(self):
        state = State.objects.get_or_create(id=1)
        return state[0]

    def get_solde(self):
        state = self.retrieve_state_row()
        return state.solde

    def update_solde(self, amount):
        ''' Update the solde in the state row
        '''
        State.objects.filter(id=1).update(solde=amount)
        
    def compute_solde(self, amount):
        ''' Recalculate the solde based on the new operation amount
            return the new value
        '''
        state = self.retrieve_state_row()
        solde = float(state.solde) + amount
        self.update_solde(solde)
        return solde