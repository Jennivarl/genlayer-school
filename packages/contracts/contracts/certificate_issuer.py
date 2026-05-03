# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *


class CertificateIssuer(gl.Contract):
    owner: Address
    issued: TreeMap[str, bool]

    def __init__(self):
        self.owner = gl.message.sender_address
        self.issued = TreeMap[str, bool]()

    @gl.public.view
    def has_certificate(self, learner_id: str) -> bool:
        return self.issued.get(learner_id, False)

    @gl.public.write
    def issue_certificate(self, learner_id: str):
        assert gl.message.sender_address == self.owner
        self.issued[learner_id] = True
